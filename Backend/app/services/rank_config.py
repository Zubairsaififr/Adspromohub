RANK_ORDER = [
    "ruby",
    "emerald",
    "sapphire",
    "topaz",
    "amethyst",
    "diamond",
    "crown_jewel",
]


RANK_CONFIG = {

    "ruby": {
        "display_name": "Ruby",

        "wallet_maintain": 50,
        "instant_bonus": 20,
        "hierarchy_cap": 100,

        "requirements": {
            "directs": 10,
        },
    },


    "emerald": {
        "display_name": "Emerald",

        "wallet_maintain": 100,
        "instant_bonus": 100,
        "hierarchy_cap": 200,

        "requirements": {
            "ruby": 3,
        },
    },


    "sapphire": {
        "display_name": "Sapphire",

        "wallet_maintain": 300,
        "instant_bonus": 200,
        "hierarchy_cap": 600,

        "requirements": {
            "emerald": 1,
            "ruby": 2,
        },
    },


    "topaz": {
        "display_name": "Topaz",

        "wallet_maintain": 500,
        "instant_bonus": 350,
        "hierarchy_cap": 1000,

        "requirements": {
            "sapphire": 2,
            "ruby": 2,
        },
    },


    "amethyst": {
        "display_name": "Amethyst",

        "wallet_maintain": 1000,
        "instant_bonus": 500,
        "hierarchy_cap": 2000,

        "requirements": {
            "topaz": 1,
            "sapphire": 1,
            "emerald": 1,
            "ruby": 2,
        },
    },


    "diamond": {
        "display_name": "Diamond",

        "wallet_maintain": 3000,
        "instant_bonus": 1000,
        "hierarchy_cap": 6000,

        "requirements": {
            "amethyst": 1,
            "topaz": 1,
            "sapphire": 2,
            "emerald": 1,
        },
    },


    "crown_jewel": {
        "display_name": "Crown Jewel",

        "wallet_maintain": 5000,
        "instant_bonus": 2000,
        "hierarchy_cap": 10000,

        "requirements": {
            "diamond": 1,
            "amethyst": 1,
            "topaz": 2,
            "sapphire": 2,
        },
    },
}