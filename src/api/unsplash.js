import { createApi } from 'unsplash-js';

const accessKey = process.env.REACT_APP_UNSPLASH_KEY;

const unsplash = createApi({
    accessKey: `${accessKey}`,
});

export default unsplash;