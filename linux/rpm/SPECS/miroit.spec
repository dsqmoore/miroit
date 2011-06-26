Name:           miroit
Version:        1.0.0
Release:        2%{?dist}
Summary:        MiroIt Plugin

License:        GPL-3
URL:            https://github.com/axet/miroit
Source0:        miroit-%{version}.tgz

BuildRequires:  gcc, xulrunner-devel
Requires:       Miro

%description

%prep
%setup -q

%build
make -C plugin
make -C extension

%install
rm -rf $RPM_BUILD_ROOT
mkdir -p $RPM_BUILD_ROOT/%{_libdir}/mozilla/plugins
mkdir -p $RPM_BUILD_ROOT/%{_libdir}/firefox-5/extensions/
cp plugin/miroit.so $RPM_BUILD_ROOT%{_libdir}/mozilla/plugins/
cp extension/miroit.xpi $RPM_BUILD_ROOT/%{_libdir}/firefox-4/extensions/{79287D2F-D399-471A-A95E-BCBED9AEDB3B}.xpi

%files
%{_libdir}/mozilla/plugins/miroit.so
%{_libdir}/firefox-4/extensions/{79287D2F-D399-471A-A95E-BCBED9AEDB3B}.xpi

%changelog

