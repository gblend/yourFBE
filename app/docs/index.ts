import schemas from './schemas';
import paths from './paths';
import generalSetup from './general';

export default {
    ...generalSetup,
    components: {
        ...schemas,
        headers: {
            contentType: 'application/json',
            accept: 'application/json'
        }
    },
    ...paths,
}
