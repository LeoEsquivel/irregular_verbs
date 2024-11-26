export const observerMutations = (containerId, callback) => {
    const container = document.getElementById(containerId);

    const observer =  new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {

            const { target } = mutation;
            debugger

            if(mutation.type === 'childList'){
                // Cambios estructurales
                callback({type: 'childList', target});
            } else if (mutation.type === "attributes" && mutation.attributeName === "style") {
                // Cambios de style
                const cssStyle = target.style.cssText;
                callback({type: "style", target, cssStyle})                
            }
        });
    });

    const observer_options = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style"],
        // attributeOldValue: true
    }

    observer.observe(container, observer_options);
}

