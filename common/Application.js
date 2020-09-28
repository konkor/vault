/*
 * This is a part of Vault package
 * Copyright (C) 2020 konkor <konkor.github.io>
 *
 * Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * You should have received a copy of the GNU General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Lang = imports.lang;
const System = imports.system;

const APPDIR = getCurrentFile ()[1];
imports.searchPath.unshift(APPDIR);

const Logger = imports.common.Logger;
const Window = imports.common.VaultWindow;


let DEBUG_LVL = 0;

var VaultApplication = new Lang.Class ({
  Name: "VaultApplication",
  Extends: Gtk.Application,

  _init: function (args) {
    GLib.set_prgname ("vault");
    this.parent ({
      application_id: "org.konkor.Vault.application",
      flags: Gio.ApplicationFlags.HANDLES_OPEN
    });
    GLib.set_application_name ("Vault");

    this.add_main_option (
      "debug", 0, GLib.OptionFlags.NONE, GLib.OptionArg.NONE,
      "Enable debugging messages", null
    );
    this.add_main_option (
      "verbose", 0, GLib.OptionFlags.NONE, GLib.OptionArg.NONE,
      "Enable verbose output", null
    );
    this.connect ("handle-local-options", this.on_local_options.bind (this));
  },

  on_local_options: function (app, options) {
    try {
      this.register (null);
    } catch (e) {
      print ("Failed to register: %s".format (e.message));
      return 1;
    }

    if (options.contains ("verbose")) {
      Logger.init (1);
    }
    if (options.contains ("debug")) {
      Logger.init (2);
    }

  return -1;
  },

  vfunc_startup: function() {
    this.parent();
  },

  vfunc_activate: function() {
    if (!this.active_window) {
      this.window = new Window.VaultWindow ({ application:this });
      this.window.show_all ();
    } else {
      this.window.present ();
    }
  },

  about: function () {
   let dlg = new Gtk.AboutDialog ({
    transient_for: this.window,
    program_name: "Vault",
    copyright: "Copyright © 2020 konkor <konkor.github.io>",
    license_type: Gtk.License.GPL_3_0,
    authors: ["konkor"],
    website: "https://github.com/konkor/vault",
    logo_icon_name: "io.github.konkor.vault"
   });
   //logo: this.window.icon,
   dlg.set_logo (this.window.icon);
   dlg.run ();
   dlg.destroy ();
  },

  get app_dir () {
    return APPDIR;
  }

});

function getCurrentFile () {
  let stack = (new Error()).stack;
  let stackLine = stack.split("\n")[1];
  if (!stackLine)
    throw new Error ("Could not find current file");
  let match = new RegExp ("@(.+):\\d+").exec(stackLine);
  if (!match)
    throw new Error ("Could not find current file");
  let path = match[1];
  let file = Gio.File.new_for_path (path);
  return [file.get_path(), file.get_parent().get_path(), file.get_basename()];
}
