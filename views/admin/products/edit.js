const layout = require("../layout");
const { getError } = require("../../helpers");

module.exports = ({ product }) => {
  return layout({
    content: `
    <form method="POST">
      <input name="title" value="${product.title}"/>
      <input name="price" value="${product.price}"/>
      <input name="image" type="file"/>
      <button>Submit</button>
    </form>
    `,
  });
};
