{
  description = "yaml-portfolio development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
    bun-pkgs = {
      url = "github:NixOS/nixpkgs/507b63021ada5fee621b6ca371c4fca9ca46f52c";
      flake = false;
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    bun-pkgs,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
        };
      in {
        devShells.default = pkgs.mkShell {
          packages = [
            (import bun-pkgs { inherit system; }).bun
          ];
        };
      }
    );
}
