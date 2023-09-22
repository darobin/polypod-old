
# polypod

**THIS IS EXPERIMENTAL. DO NOT EXPECT ANYTHING TO WORK, OR EVEN MAKE SENSE.**

The thesis is that we need a system that:

- Is a *user agent* but can do more than a browser, notably be connected persistently and
  carry out smarter automation.
- Supports *polylegal* governance, which is to say that it can create governed systems that
  are shared with others, declare various rules that it abides by in given contexts, and
  enforce where needed. (The polylaw concept is taken from [the work of Ada Palmer](https://en.wikipedia.org/wiki/Too_Like_the_Lightning)
  but existed in earlier times.)
- Is LoFi (local first) and can sync itself to various places (e.g. be partly on your
  phone, have different identities in different places, all kinds of confidentiality levels).
- Supports "big world" integrations (e.g. having the content you publish indexed globally
  so that others can easily find it) but only under the control of those who contribute
  content.
- Might go so far as to eliminate the notion of server, replacing it with pods communicating
  with each other.

I am playing with primitives from:

- [ATProtocol](https://atproto.com/)
- [IPFS](https://ipfs.tech/) and [Iroh](https://iroh.computer/)
- [Minecraft server governance](https://www.semanticscholar.org/search?q=%5C%22Seth%20Frey%5C%22&sort=relevance)
- [WNFS](https://github.com/wnfs-wg/)
- [CRDTs](https://yjs.dev/)
- [UCANs](https://ucan.xyz/)

and other stuff that's too new for anyone to know how it'll play out.

## Running This Thing

- `npm install` (or whichever one you love the most) as per usual
- it expects Pg server running localhost with databases called `polypod` and `polypod-test`
- all the PDS passwords are `hunter2` — if you run this in production somehow, you know what's coming

![polypody](polypody.jpg)
