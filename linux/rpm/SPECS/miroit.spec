Name:           miroit
Version:        1.0.0
Release:        1%{?dist}
Summary:        MiroIt Plugin

License:        GPL-3
URL:            https://github.com/axet/miroit
Source0:        miroit-%{version}.tgz

BuildRequires:  gcc
Requires:       Miro

%description

%prep
%setup -q

%build
make -C plugin
make -C extension

%install
rm -rf $RPM_BUILD_ROOT
mkdir -p $RPM_BUILD_ROOT/usr/lib/mozilla/plugins
mkdir -p $RPM_BUILD_ROOT/usr/lib/firefox-4/extensions/
cp plugin/miroit.so $RPM_BUILD_ROOT/usr/lib/mozilla/plugins/
cp extension/miroit.xpi $RPM_BUILD_ROOT/usr/lib/firefox-4/extensions/{79287D2F-D399-471A-A95E-BCBED9AEDB3B}.xpi

%files
/usr/lib/mozilla/plugins/miroit.so
/usr/lib/firefox-4/extensions/{79287D2F-D399-471A-A95E-BCBED9AEDB3B}.xpi

%changelog

