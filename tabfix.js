/* Allow tab indentation on textareas. */
let textAreas = document.getElementsByTagName("textarea");
for(let i = 0; i < textAreas.length; i++) {
    let textArea = textAreas[i];
    textArea.addEventListener("keydown", function(event) {
        if(event.key == "Tab") {
            event.preventDefault();
            let select = this.selectionStart;
            this.value = this.value.substring(0, this.selectionStart) + "    " + this.value.substring(this.selectionEnd);
            this.selectionEnd = select + 4;
        }
    });
}