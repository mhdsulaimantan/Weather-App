export const createLoader = async () => {
    document.body.classList.add("opacity-25");
    const loader = document.createElement('div');
    loader.id = "loader";
    loader.className = "position-absolute top-50 start-50 spinner-border text-info";
    document.body.append(loader);

    return loader;
}

export const removeLoader = async (loader) => {
    loader.remove();
    document.body.classList.remove("opacity-25");
}