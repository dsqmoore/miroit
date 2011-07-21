/* ***** BEGIN LICENSE BLOCK *****
 * (C)opyright 2008-2009 Aplix Corporation. anselm@aplixcorp.com
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 * ***** END LICENSE BLOCK ***** */

#include <stdio.h>
#include <string.h>

#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <stdint.h>

#if defined(XULRUNNER_SDK)
#include <npapi.h>
#include <npfunctions.h>
#include <prtypes.h>
#include <npruntime.h>
#elif defined(ANDROID)

#undef HAVE_LONG_LONG
#include <jni.h>
#include <npapi.h>
#include <npfunctions.h>
#include <npruntime.h>
#define OSCALL
#define NPP_WRITE_TYPE (NPP_WriteProcPtr)
#define NPStringText UTF8Characters
#define NPStringLen  UTF8Length
extern JNIEnv *pluginJniEnv;

#elif defined(WEBKIT_DARWIN_SDK)

#include <Webkit/npapi.h>
#include <WebKit/npfunctions.h>
#include <WebKit/npruntime.h>
#define OSCALL

#elif defined(WEBKIT_WINMOBILE_SDK) /* WebKit SDK on Windows */

#ifndef PLATFORM
#define PLATFORM(x) defined(x)
#endif
#include <npfunctions.h>
#ifndef OSCALL
#define OSCALL WINAPI
#endif

#endif

static NPObject *so = NULL;
static NPNetscapeFuncs *npnfuncs = NULL;
static NPP inst = NULL;

static char* StringToChars(NPString string) {
  // Some browsers' length includes the '\0', others' do not.
  // Therefore we need to build a string that has a '\0' afterwards.
  char * str = malloc(string.UTF8Length + 1);
  if (NULL == str) {
    return NULL;
  }
  memcpy(str, string.UTF8Characters, string.UTF8Length);
  str[string.UTF8Length] = '\0';
  return str;
}

/* NPN */

static bool hasMethod(NPObject* obj, NPIdentifier methodName) {
  return true;
}

static bool invokeDefault(NPObject *obj, const NPVariant *args, uint32_t argCount, NPVariant *result) {
  result->type = NPVariantType_Int32;
  result->value.intValue = 0;
  return true;
}

static bool invokeMiro(NPObject *obj, const NPVariant *args, uint32_t argCount, NPVariant *result) {
  if (argCount != 1)
    return false;

  const char* url = StringToChars(NPVARIANT_TO_STRING(args[0]));

  int pid = fork();
  if (pid == 0)
  {
    {
      const char *app;
      struct stat sb;
      app = "/Applications/Miro.app";
      if (stat(app, &sb) == 0 && S_ISDIR(sb.st_mode))
      {
    	char *env[] = { "LANG=UTF-8", NULL };
    	execle("/usr/bin/open", "/usr/bin/open", "-g", "-a", app, url, 0, env);
      }
    }
    {
      const char *app;
      struct stat sb;
      app = "/usr/bin/miro";
      if (stat(app, &sb) == 0 && S_ISREG(sb.st_mode))
      {
        execl(app, app, url, 0);
      }
    }
  }

  free(url);

  result->type = NPVariantType_Int32;
  result->value.intValue = 0;
  return true;
}

static bool invoke(NPObject* obj, NPIdentifier methodName, const NPVariant *args, uint32_t argCount, NPVariant *result) {
  char *name = npnfuncs->utf8fromidentifier(methodName);
  if (name) {
    if (!strcmp(name, "miro")) {
      return invokeMiro(obj, args, argCount, result);
    }
  }
  // aim exception handling
  npnfuncs->setexception(obj, "exception during invocation");
  return false;
}

static bool hasProperty(NPObject *obj, NPIdentifier propertyName) {
  return false;
}

static bool getProperty(NPObject *obj, NPIdentifier propertyName, NPVariant *result) {
  return false;
}

static NPClass npcRefObject = { NP_CLASS_STRUCT_VERSION, NULL, NULL, NULL, hasMethod, invoke, invokeDefault,
    hasProperty, getProperty, NULL, NULL, };

/* NPP */

static NPError nevv(NPMIMEType pluginType, NPP instance, int mode, int argc, char *argn[], char *argv[],
    NPSavedData *saved) {
  inst = instance;
  return NPERR_NO_ERROR;
}

static NPError destroy(NPP instance, NPSavedData **save) {
  if (so)
    npnfuncs->releaseobject(so);
  so = NULL;
  return NPERR_NO_ERROR;
}

static NPError getValue(NPP instance, NPPVariable variable, void *value) {
  inst = instance;

  switch (variable) {
  case NPPVpluginNameString:
    *((char **) value) = "MiroIt";
    break;
  case NPPVpluginDescriptionString:
    *((char **) value) = "MiroIt run plugin";
    break;
  case NPPVpluginScriptableNPObject:
    if (!so)
      so = npnfuncs->createobject(instance, &npcRefObject);
    npnfuncs->retainobject(so);
    *(NPObject **) value = so;
    break;
#if defined(XULRUNNER_SDK)
    case NPPVpluginNeedsXEmbed:
    *((PRBool *)value) = PR_FALSE;
    break;
#endif
  default:
    return NPERR_GENERIC_ERROR;
  }
  return NPERR_NO_ERROR;
}

static NPError /* expected by Safari on Darwin */
handleEvent(NPP instance, void *ev) {
  inst = instance;
  return NPERR_NO_ERROR;
}

static NPError /* expected by Opera */
setWindow(NPP instance, NPWindow* pNPWindow) {
  inst = instance;
  return NPERR_NO_ERROR;
}

/* EXPORT */
#ifdef __cplusplus
extern "C" {
#endif

NPError OSCALL
NP_GetEntryPoints(NPPluginFuncs *nppfuncs) {
  nppfuncs->version = (NP_VERSION_MAJOR << 8) | NP_VERSION_MINOR;
  nppfuncs->newp = nevv;
  nppfuncs->destroy = destroy;
  nppfuncs->getvalue = getValue;
  nppfuncs->event = handleEvent;
  nppfuncs->setwindow = setWindow;

  return NPERR_NO_ERROR;
}

#ifndef HIBYTE
#define HIBYTE(x) ((((int)(x)) & 0xff00) >> 8)
#endif

NPError OSCALL
NP_Initialize(NPNetscapeFuncs *npnf
#if defined(ANDROID)
    , NPPluginFuncs *nppfuncs, JNIEnv *env, jobject plugin_object
#elif !defined(_WINDOWS) && !defined(WEBKIT_DARWIN_SDK)
    , NPPluginFuncs *nppfuncs
#endif
) {
  if (npnf == NULL)
    return NPERR_INVALID_FUNCTABLE_ERROR;

  if (HIBYTE(npnf->version) > NP_VERSION_MAJOR)
    return NPERR_INCOMPATIBLE_VERSION_ERROR;

  npnfuncs = npnf;
#if !defined(_WINDOWS) && !defined(WEBKIT_DARWIN_SDK)
  NP_GetEntryPoints(nppfuncs);
#endif
  return NPERR_NO_ERROR;
}

NPError
OSCALL NP_Shutdown() {
  return NPERR_NO_ERROR;
}

char * NP_GetMIMEDescription(void) {
  return "application/miroit-run-plugin:miroit:MiroIt run plugin";
}

/* needs to be present for WebKit based browsers */
NPError OSCALL NP_GetValue(void *npp, NPPVariable variable, void *value) {
  inst = (NPP) npp;
  return getValue((NPP) npp, variable, value);
}

#ifdef __cplusplus
}
#endif
