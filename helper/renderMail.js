
function renderTemplate(template, data) {
    for (let key in data) {
      const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      template = template.replace(pattern, data[key]);
    }
    return template;
  }

module.exports = renderTemplate;