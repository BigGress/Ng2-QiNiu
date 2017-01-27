declare namespace toastr {
    function alert(str: string): void;

    function confirm(str: string): Promise<boolean>;
}

interface toastr {
    alert(str: string): void;

    confirm(str: string): Promise<boolean>;
}
