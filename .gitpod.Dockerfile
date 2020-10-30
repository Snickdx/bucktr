FROM gitpod/workspace-full

# Install custom tools, runtimes, etc.
# For example "bastet", a command-line tetris clone:
RUN npm i -g firebase-cli
RUN npm i -g ionic@3.20.0

# More information: https://www.gitpod.io/docs/config-docker/
