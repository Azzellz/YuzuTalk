export const vKeyUp = {
    mounted(el: HTMLElement, binding: any) {
        console.log(el)
        el.addEventListener('keydown', function(e){
            console.log(e)
        })
    },
    beforeUnmount(el: HTMLElement, binding: any) {
        el.removeEventListener('keydown', function (e) {
            console.log(e)
        })
    }
}
