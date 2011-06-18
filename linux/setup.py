#!/usr/bin/env python

from distutils.core import setup

setup(name='openvpn-upnp',
      version='1.0.0',
      scripts=['openvpn-upnp.py',
               'openvpn-upnp-up.sh',
               'openvpn-upnp-down.sh',
               ],
      )

