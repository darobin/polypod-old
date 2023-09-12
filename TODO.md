
- [ ] Milestone: Integrated Hack
  - [ ] PLC server
    - [ ] run whatever migrations and settings are needed as seen in dev-env and the deploy repo (save as command for readme)
    - [ ] integrate plc server directly into the main process and run from there (just like PDS)
    - [ ] run whatever is needed to create a few users (save the command too)
    - [ ] add some basic tests to validate that it works
  - [ ] PDS server
    - [ ] run whatever migrations and settings are needed as seen in dev-env and the deploy repo (save as command for readme)
    - [ ] integrate directly
    - [ ] add some basic tests to validate that it works
  - [ ] Ping Method
    - [ ] move the ping method to be exposed via the pds (use pds.ctx to access the APIs)
    - [ ] wrap the implementation with very minimal access so it's as safe as possible, no direct access as current
    - [ ] test!
  - [ ] HSV (Hyped Social Venue) Methods
    - [ ] set up just the minimal set of methods for the simplest social posting of colours
    - [ ] same wrapping, but need to add more access
    - [ ] test!
- [ ] Milestone: WASM WASM WASM
  - [ ] setup AssemblyScript
  - [ ] ping
  - [ ] hsv


- [ ] Move to a monorepo with server, client, protocols, and deploy (uses the server+protocols)
