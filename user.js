module.exports = (config, Ferdium) => {

  // Used as a className and localStorage key
  const key = "x-vertical"

  let btnToggle = document.createElement('div')
  btnToggle.className = "board-header-btn"
  btnToggle.style.padding = "0 12px"
  let lblBtnToggle = document.createElement('span')
  lblBtnToggle.className = "board-header-btn-text"
  lblBtnToggle.innerText = "Toggle layout"
  lblBtnToggle.style.userSelect = "none"
  lblBtnToggle.style.paddingRight = "0"
  btnToggle.appendChild(lblBtnToggle)

  btnToggle.onclick = () => {
    localStorage.setItem(key, document.querySelector('#board').classList.toggle(key))
  }

  function hideButton() {
    btnToggle.style.display = 'none'
  }

  function showButton() {
    btnToggle.style.display = ''
  }

  //

  function waitForTarget(selector, cb) {
    let shouldRun = true

    function cancelFn() {
      shouldRun = false
    }

    function check() {
      if (!shouldRun) return

      let target = document.querySelector(selector)
      if (!target) {
        console.log("Didn't see target", selector, "Retrying in 500ms");
        setTimeout(check, 500)
      } else {
        console.log('Found target', selector, target);
        cb(target)
      }
    }

    setTimeout(check, 500)
    return cancelFn
  }

  waitForTarget('[aria-label="Star or unstar board"]', (target) => {
    const addButton = target => target.parentElement.insertBefore(btnToggle, target.nextSibling)
    let targets = ['.mod-board-name', '[aria-label="Board name"]']
    let cancelFns = targets.map(target => waitForTarget(target, (...args) => {
      addButton(...args)
      cancelFns.map(fn => fn())
    }))

    localStorage.setItem(key, document.querySelector('#board').classList.toggle(key, localStorage.getItem(key) === "true"))

    new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type !== 'attributes' || mutation.attributeName !== 'class') continue
        // if (mutation.target.dataset.testid !== 'view-switcher-button-board') continue

        let { target } = mutation;

        if (target.classList.length >= 2) {
          showButton()
        } else {
          hideButton()
        }
      }
    }).observe(target, { attributes: true, subtree: true })
  })
};
