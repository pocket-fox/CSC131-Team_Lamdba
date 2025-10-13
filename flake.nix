{
  description = "CSC131 Project environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    # nix-utils
  };

  outputs = { self, nixpkgs, }: 
  let
    system = "x86_64-linux";
    # system = "aarch64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in
  {
    devShells.${system}.default = 
      pkgs.mkShell
        {
          buildInputs = with pkgs; [
            typst

            nodejs
            typescript-language-server

            # Necessary for local testing of github actions
            act
          ];

          shellHook = ''
            echo "Using Team Lambda Project environment"
          '';
        };
    
  };
}
