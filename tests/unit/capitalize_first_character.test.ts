import {capitalizeFirstCharacter} from '../../app/lib/utils';


describe('CapitalizeFirstCharacter', () => {
    it('should return null when input is null', () => {
        const input = null;

        expect(capitalizeFirstCharacter(input)[0]).toEqual(input);
    });

    it('should return undefined when input is undefined', () => {
        const input = undefined;

        expect(capitalizeFirstCharacter(input)[0]).toEqual(input);
    });

    it('should return output with first character capitalized', () => {
        const input = 'yourFeeds';

        expect(capitalizeFirstCharacter(input)[0]).toEqual('YourFeeds');
    });

    it('should return output with each first character capitalized with 2 input', () => {
        const input = 'your';
        const input2 = 'feeds';
        const res = capitalizeFirstCharacter(input, input2);

        expect(res[0]).toEqual('Your');
        expect(res[1]).toEqual('Feeds');
    });

    it('should return first character capitalized when input is a single character', () => {
        const input = 'a';

        expect(capitalizeFirstCharacter(input)[0]).toEqual(input.toLocaleUpperCase());
    });
});
