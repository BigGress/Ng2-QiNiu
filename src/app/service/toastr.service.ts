import { Injectable } from "@angular/core";



@Injectable()
export class toastr {
    alert(str: string) {
        alert(str);
    }

    confirm(str: string) {
        let value = confirm(str);

        if (value) {
            return Promise.resolve(true);
        } else {
            return Promise.reject(false);
        }
    }
}

