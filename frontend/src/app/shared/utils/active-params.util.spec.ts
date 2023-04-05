import {ActiveParamsUtil} from "./active-params.util";

describe('active params util', () => {

  it('should change type string to type array ', () => {

    const result = ActiveParamsUtil.processParams({
      categories: 'frilans'
    });

    expect(result.categories).toBeInstanceOf(Array);

  });

  it('should change page string to int', () => {

    const result = ActiveParamsUtil.processParams({
      page: '4'
    });

    expect(result.page).toBe(4);

  });

  it('should change page string to undefined', () => {

    const result: any = ActiveParamsUtil.processParams({
      string: 'test'
    });

    expect(result.string).toBeUndefined();

  });

});
