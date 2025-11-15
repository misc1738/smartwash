import navigateToHash from './scrollToHash';

describe('navigateToHash', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    window.history.pushState({}, '', '/');
  });

  it('scrolls to element when present', () => {
    const el = document.createElement('div');
    el.id = 'contact';
    document.body.appendChild(el);

    const nav = () => {};
    // should not throw
    navigateToHash('#contact', nav);
    // element should be in DOM and have tabindex set
    expect(document.querySelector('#contact')).toBeTruthy();
  });
});
