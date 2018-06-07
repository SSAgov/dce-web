import React from 'react';
import renderer from 'react-test-renderer';
import TestConvert from '../src/Convert/TestConvert';
import { mount } from 'enzyme';

/* eslint-disable */

test('create snapshot', () => {
    const component = renderer.create(<TestConvert />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

const props = {
    onSubmit: jest.fn(),
    onChange: jest.fn()
};

describe('Convert - Selects change value', () => {
    const wrapper = mount(<TestConvert {...props} />);

    it('changes appID value correctly', () => {
        const appID = wrapper.find('select').first();
        appID.simulate('change', { target: { value: 'ERE' } });
        expect(appID.node.value).toBe('ERE');

        appID.simulate('change', { target: { value: 'HIT' } });
        expect(appID.node.value).toBe('HIT');

        appID.simulate('change', { target: { value: 'H1T' } });
        expect(appID.node.value).toBe('H1T');

        appID.simulate('change', { target: { value: 'Other' } });
        expect(appID.node.value).toBe('Other');
    })
})