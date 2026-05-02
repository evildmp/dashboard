function initConditionNoteEditors(root) {
  if (typeof tinymce === "undefined") return;

  const container = root || document;
  const textareas = container.querySelectorAll('textarea[data-note-editor="tinymce"]');

  textareas.forEach((textarea) => {
    if (!textarea.id) return;

    const existing = tinymce.get(textarea.id);
    if (existing) {
      existing.remove();
    }

    tinymce.init({
      target: textarea,
      menubar: false,
      statusbar: false,
      branding: false,
      plugins: "autolink lists link",
      toolbar: "bold italic bullist link removeformat",
      height: 180,
      valid_elements: "a[href|target=_blank],strong,em,p,ul,li,br",
      content_style: "body { font-size: 14px; margin: 8px; }",
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initConditionNoteEditors(document);
});

document.body.addEventListener("htmx:configRequest", (event) => {
  const trigger = event.target;
  if (!trigger || !trigger.closest || !trigger.closest(".note-dialog-form")) return;

  const form = trigger.closest(".note-dialog-form");
  const textarea = form.querySelector("textarea[name='note']");
  if (!textarea) return;

  if (typeof tinymce !== "undefined") {
    const editor = tinymce.get(textarea.id);
    if (editor) {
      event.detail.parameters.note = editor.getContent();
      return;
    }
  }

  event.detail.parameters.note = textarea.value;
});

document.body.addEventListener("htmx:afterSwap", (event) => {
  initConditionNoteEditors(event.target);
});
