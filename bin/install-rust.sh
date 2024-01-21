#!/bin/bash

# Install Rustup (compiler)
echo "Installing rustup..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Adding binaries to path
source "$HOME/.cargo/env"

# install the nightly toolchain
echo "Installing nightly toolchain..."
rustup toolchain install nightly

# change to nightly
echo "Setting override..."
rustup override set nightly

# set nightly to default
# rustup defaut nightly

