{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  packages = with pkgs; [ 
    (import (builtins.fetchTarball "https://github.com/NixOS/nixpkgs/archive/507b63021ada5fee621b6ca371c4fca9ca46f52c.tar.gz") {}).bun#1.2.10
    ];
}
