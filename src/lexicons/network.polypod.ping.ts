
import { LexiconDoc } from "@atproto/lexicon";

const ping: LexiconDoc = {
  lexicon: 1,
  id: 'network.polypod.ping',
  defs: {
    main: {
      type: 'query',
      parameters: {
        type: 'params',
        properties: { message: { type: 'string' } },
      },
      output: {
        encoding: 'application/json',
      },
    },
  },
};

export default ping;
