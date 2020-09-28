## Process this file with automake to produce Makefile.in

APP_ID = vault

DIST_SUBDIRS = data

SUBDIRS = data

jsdir = $(datadir)/$(APP_ID)
js_DATA = \
    README.md \
    konkor.vault.policy \
    LICENSE

js_SCRIPTS = vault \
    shutdown-vault

bin_SCRIPTS = vault

dist_js_DATA = $(js_SCRIPTS)

dist_doc_DATA = \
	README.md

EXTRA_DIST = $(js_DATA)

uninstall-local:
	-rm -r $(jsdir)

