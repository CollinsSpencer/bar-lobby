import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
// import Nora from "@primevue/themes/nora";
// import Material from "@primevue/themes/material";

// https://primevue.org/theming/styled/

export const BarThemePreset = definePreset(Aura, {
    // color palette generated on https://primevue.org/
    primitive: {
        gray: {
            50: "#f9f9f9",
            100: "#e1e1e1",
            200: "#c8c8c8",
            300: "#b0b0b0",
            400: "#989898",
            500: "#808080",
            600: "#6d6d6d",
            700: "#5a5a5a",
            800: "#464646",
            900: "#333333",
            950: "#202020",
        },
        green: {
            50: "#f8fcf5",
            100: "#dfefcf",
            200: "#c5e3aa",
            300: "#abd684",
            400: "#92ca5f",
            500: "#78bd39",
            600: "#66a130",
            700: "#548428",
            800: "#42681f",
            900: "#304c17",
            950: "#1e2f0e",
        },
        sky: {
            50: "#f3f8fc",
            100: "#c5dcf2",
            200: "#97c0e7",
            300: "#6aa4dc",
            400: "#3c89d2",
            500: "#0e6dc7",
            600: "#0c5da9",
            700: "#0a4c8b",
            800: "#083c6d",
            900: "#062c50",
            950: "#041b32",
        },
        orange: {
            50: "#fcf8f3",
            100: "#f2dcc5",
            200: "#e7c097",
            300: "#dca46a",
            400: "#d2893c",
            500: "#c76d0e",
            600: "#a95d0c",
            700: "#8b4c0a",
            800: "#6d3c08",
            900: "#502c06",
            950: "#321b04",
        },
        purple: {
            50: "#fcf3fc",
            100: "#f2c5f2",
            200: "#e797e7",
            300: "#dc6adc",
            400: "#d23cd2",
            500: "#c70ec7",
            600: "#a90ca9",
            700: "#8b0a8b",
            800: "#6d086d",
            900: "#500650",
            950: "#320432",
        },
        red: {
            50: "#fbf4f4",
            100: "#e9c9c9",
            200: "#d89e9e",
            300: "#c77474",
            400: "#b64949",
            500: "#a51e1e",
            600: "#8c1a1a",
            700: "#731515",
            800: "#5b1111",
            900: "#420c0c",
            950: "#290808",
        },
    },

    semantic: {
        // content: { background: "#ffbb00" },
        primary: {
            50: "{gray.50}",
            100: "{gray.100}",
            200: "{gray.200}",
            300: "{gray.300}",
            400: "{gray.400}",
            500: "{gray.500}",
            600: "{gray.600}",
            700: "{gray.700}",
            800: "{gray.800}",
            900: "{gray.900}",
            950: "{gray.950}",
        },
        colorScheme: {
            dark: {
                surface: {
                    0: "#ffffff",
                    50: "{gray.50}",
                    100: "{gray.100}",
                    200: "{gray.200}",
                    300: "{gray.300}",
                    400: "{gray.400}",
                    500: "{gray.500}",
                    600: "{gray.600}",
                    700: "{gray.700}",
                    800: "{gray.800}",
                    900: "{gray.900}",
                    950: "{gray.950}",
                },
                primary: {
                    color: "{primary.500}",
                    contrastColor: "#ffffff",
                    hoverColor: "{primary.600}",
                    activeColor: "{primary.700}",
                },
                // highlight: {
                //     background: "{primary.800}",
                //     focusBackground: "{primary.700}",
                //     color: "{primary.300}",
                //     focusColor: "{primary.200}",
                // },
                // mask: {
                //     background: 'rgba(0,0,0,0.4)',
                //     color: '{surface.200}'
                //   },
                // text: {
                //     color: "{surface.300}",
                //     hoverColor: "{surface.200}",
                //     mutedColor: "{surface.500}",
                //     hoverMutedColor: "{surface.400}",
                // },

                formField: {
                    borderRadius: "0",
                    background: "color-mix(in srgb, {primary.200}, transparent 90%)",
                    color: "{surface.200}",
                    placeholder: { color: "{surface.200}" },
                    disabledBackground: "color-mix(in srgb, {surface.700}, transparent 90%)",
                    // disabled: { color: "{surface.400}", background: "color-mix(in srgb, {primary.600}, transparent 90%)", border: "{surface: 600}" },
                },
                overlay: {
                    select: {
                        background: "{surface.900}",
                        borderColor: "{surface.800}",
                        borderRadius: "0",
                    },
                    popover: {
                        background: "{surface.900}",
                        borderRadius: "0",
                    },
                    modal: {
                        background: "{surface.900}",
                        borderRadius: "0",
                    },
                },

                list: { padding: "0", option: { focusBackground: "{surface.700}", borderRadius: "0" } },
                navigation: {
                    item: {
                        focusBackground: "{surface.700}",
                        activeBackground: "{surface.900}",
                        color: "{text.color}",
                        focusColor: "{text.hover.color}",
                        activeColor: "{text.hover.color}",
                        icon: {
                            color: "{surface.400}",
                            focusColor: "{surface.500}",
                            activeColor: "{surface.500}",
                        },
                    },
                    submenuLabel: {
                        background: "transparent",
                        color: "{text.muted.color}",
                    },
                    submenuIcon: {
                        color: "{surface.400}",
                        focusColor: "{surface.500}",
                        activeColor: "{surface.500}",
                    },
                },
            },
        },
    },

    components: {
        slider: {
            colorScheme: {
                dark: {
                    track: {
                        background: "{surface.800}",
                    },
                    handle: {
                        contentHoverBackground: "{surface.50}",
                        contentBackground: "{surface.100}",
                    },
                },
            },
        },
        togglebutton: {
            colorScheme: {
                dark: {
                    root: {
                        background: "{form.field.background}",
                        color: "{form.field.color}",
                        hoverColor: "{form.field.color}",
                        checkedColor: "{form.field.color}",
                        checkedBorderColor: "{form.field.border.color}",
                        borderColor: "{form.field.border.color}",
                        hoverBackground: "{surface.800}",
                        checkedBackground: "{surface.700}",
                        disabledBackground: "{form.field.disabled.background}",
                        disabledBorderColor: "{form.field.border.color}",
                        disabledColor: "{form.field.disabled.color}",
                        invalidBorderColor: "{form.field.invalid.border.color}",
                    },
                    content: {
                        checkedBackground: "transparent",
                        checkedShadow: "none",
                    },
                },
            },
        },
        checkbox: {
            root: {
                borderRadius: "0",
                width: "2.7rem",
                height: "2.7rem",
            },
        },
    },
});
