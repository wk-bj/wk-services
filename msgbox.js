/**
 * 提示框消息，给services.js使用，services.js需要消息提示框
 */
import "./msg.css";

let _index = 5000;

function showMessage(option) {
  const body = document.body;

  let config = {
    showClose: true,
    type: "error",
    duration: 4000
  };

  if (option) {
    for (const key in option) {
      config[key] = option[key];
    }
  }

  let html =
    `<i class="el-message__icon el-icon-${config.type}"></i>` +
    `<p class="dss-common-msg__content"><span>${config.message}</span></p>`;

  const div = document.createElement("div");
  div.className = `dss-common-msg dss-common-msg--${config.type}`;
  div.style.zIndex = _index++;

  div.innerHTML = html;
  body.appendChild(div);

  setTimeout(() => {
    body.removeChild(div);
  }, config.duration);
}

export default showMessage;
