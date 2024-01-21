#!/bin/bash

# Install Rustup (compiler)
echo "Installing rustup..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Adding binaries to path
source "$HOME/.cargo/env"

# install the nightly toolchain
echo "Installing nightly toolchain..."
rustup toolchain install nightly-x86_64-unknown-linux-gnu
rustup override set nightly-x86_64-unknown-linux-gnu 
rustup component add rust-src --toolchain nightly-x86_64-unknown-linux-gnu

# set nightly to default
# rustup defaut nightly


