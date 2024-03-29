function hasClass(elem, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(elem.className);
}

function addClass(elem, className) {
  if (hasClass(elem, className)) {
    return;
  }
  let newClassList = elem.className.split(' ');
  newClassList.push(className);
  elem.className = newClassList.join(' ');
}

function removeClass(elem, className) {
  if (!hasClass(elem, className)) {
    return;
  }
  let newClassList = elem.className.split(' ');
  let markedIndex = newClassList.indexOf(className);
  newClassList.splice(markedIndex, 1);
  elem.className = newClassList.join(' ');
}

window.$message = function (options) {
  let { status = 'danger', content = '', duration = 3000 } = options;

  if (typeof options === 'string') {
    content = options;
  }

  const HTML = `
      <p class="g__message__notice__content alert alert-${status}">
        <span class="content">${content}</span>
      </p>
    `;

  let messageWrapper = document.getElementsByClassName('g__message__wrapper')[0];

  if (!messageWrapper) {
    let newNode = document.createElement('div');
    newNode.setAttribute('class', 'g__message__wrapper');
    document.body.appendChild(newNode);
    messageWrapper = newNode;
  }

  const $messageDom = document.createElement('div');
  $messageDom.setAttribute('class', 'g__message__notice');
  $messageDom.innerHTML = HTML;
  messageWrapper.appendChild($messageDom);

  setTimeout(() => {
    messageWrapper.removeChild($messageDom);
  }, duration);

};

window.CODE_OK = 0;

window.CODE_ERROR = 1;

document.addEventListener('keydown', e => {
  // 27 -> esc
  // 32 -> space
  // 38 -> enter
  const keyCodes = [27];
  let keyCode = e.keyCode;
  if (keyCodes.includes(keyCode)) {
    closeDialog();
  }
});

function openDialog(dialog) {
  dialog = dialog || document.getElementById('dialog');
  dialog.style.display = 'block';
  addClass(dialog, 'dialog__open');
  removeClass(dialog, 'dialog__close');
}

function closeDialog(dialog) {
  console.log('close');
  console.log(dialog);
  dialog = dialog || document.getElementById('dialog');
  dialog.style.display = 'none';
  removeClass(dialog, 'dialog__open');
  addClass(dialog, 'dialog__close');
}

window.onload = function () {
  const dialog = document.getElementById('dialog');

  if (dialog) {
    const confirm = document.getElementById('confirm');
    if (confirm) {
      confirm.addEventListener('click', () => {
        setTimeout(() => {
          closeDialog(dialog);
        }, 1000);
      });
    }

    const close = document.getElementById('close');
    if (close) {
      close.addEventListener('click', () => {
        closeDialog(dialog);
      });
    }
  }
};
