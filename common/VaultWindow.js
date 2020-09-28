/*
 * This is a part of Vault package
 * Copyright (C) 2020 konkor <konkor.github.io>
 *
 * Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * You should have received a copy of the GNU General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const Gtk = imports.gi.Gtk;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const System = imports.system;

const Gettext = imports.gettext.domain('org.konkor.vault');
const _ = Gettext.gettext;

const Logger = imports.common.Logger;

let APPDIR = "";
let theme_gui = "/data/themes/default/gtk.css";
let cssp = null;

var VaultWindow = new Lang.Class ({
  Name: "VaultWindow",
  Extends: Gtk.ApplicationWindow,

  _init: function (params) {
    this.parent (params);
    APPDIR = this.application.current_dir;
    theme_gui = APPDIR + theme_gui;
    this.set_icon_name ("io.github.konkor.vault");
    if (!this.icon) try {
      this.icon = Gtk.Image.new_from_file (APPDIR + "/data/icons/hicolor/scalable/apps/io.github.konkor.vault.svg").pixbuf;
    } catch (e) {
      error (e.message);
    }
  },

  build: function () {
    this.set_default_size (640, 320);
    this.set_position (Gtk.WindowPosition.CENTER);
    Gtk.Settings.get_default().gtk_application_prefer_dark_theme = true;
    cssp = get_css_provider ();
    if (cssp) {
      Gtk.StyleContext.add_provider_for_screen (
        this.get_screen(), cssp, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);
    }
  },

  show_message: function (text, bar_type, timeout) {
        this.unschedule_message ();
        this.infobar = new Gtk.InfoBar ();
        if (bar_type == Gtk.MessageType.QUESTION) {
            this.infobar.add_button ("gtk-yes", Gtk.ResponseType.YES);
            this.infobar.add_button ("gtk-cancel", Gtk.ResponseType.CANCEL);
        } else {
            this.infobar.add_button ("gtk-close", Gtk.ResponseType.YES);
            this.infobar.set_default_response (Gtk.ResponseType.OK);
        }
        this.infobar.set_message_type (bar_type);
        var content = this.infobar.get_content_area ();
        content.add (new Gtk.Label ({label: text, use_markup:true, xalign:0.75}));

        this.infobox.add (this.infobar);
        this.infobar.show_all ();
        this.infobar.connect ('response', (o, e) => {
            //print (e, Gtk.ResponseType.YES, Gtk.ResponseType.OK);
            this.unschedule_message ();
        });
        if (timeout) infobar_event = GLib.timeout_add_seconds (0, timeout, () => {
            this.unschedule_message ();
            return false;
        });
    },

    unschedule_message: function () {
        if (infobar_event) GLib.Source.remove (infobar_event);
        infobar_event = 0;
        if (this.infobar) try {this.infobar.destroy ();}catch(e){}
        this.infobar = null;
        System.gc();
    },

    show_info: function (text) {
        this.show_message (text, Gtk.MessageType.INFO, 10);
    }
});

function get_css_provider () {
  let cssp = new Gtk.CssProvider ();
  let css_file = Gio.File.new_for_path (theme_gui);
  try {
    cssp.load_from_file (css_file);
  } catch (e) {
    print (e);
    cssp = null;
  }
  return cssp;
}

const DOMAIN = "MainWindow";
function error (msg) {Logger.error (DOMAIN, msg)}
function debug (msg) {Logger.debug (DOMAIN, msg)}
function info (msg) {Logger.info (DOMAIN, msg)}
