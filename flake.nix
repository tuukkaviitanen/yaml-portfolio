{
  description = "yaml-portfolio development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
    bun-pkgs = {
      url = "github:NixOS/nixpkgs/12a55407652e04dcf2309436eb06fef0d3713ef3"; # has Bun 1.2.13
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
