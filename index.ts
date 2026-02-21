import { ScryfallList, ScryfallCard } from "@scryfall/api-types"

import base_prompt from './prompt.js'
import ollama from "ollama"

const program_args = process.argv.slice(2);

const query_components: Array<string> = [];
var llm_query = "";

for(const arg of program_args) {
    if(arg.startsWith("??")) {
        llm_query = arg.slice(2);
        continue;
    }

    query_components.push(encodeURIComponent(arg))
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const min_time_between_requests = 100;
var last_request_time: number;
async function request_list(url: string): Promise<ScryfallList.Cards> {
    const now = Date.now();

    const difference = (last_request_time+min_time_between_requests) - now;
    if(difference > 0) {
        sleep(difference);
    }

    last_request_time = now;
    return await (
        await fetch(url_query, {
            method: "GET",
            headers: [
                [
                    "Accept",
                    "application/json"
                ],
                [
                    "User-Agent",
                    "MTGCardDredger/1.0"
                ]
            ]
        })
    ).json();
}


type SmallCard = {
    color_identity: Array<string>,
    faces: Array<{
        name: string,
        mana_cost: string,
        oracle_text: string,
        power: string,
        toughness: string,
    }>,
}
function minimize_card(card: ScryfallCard.Any): SmallCard {
    const out: SmallCard = {
        color_identity: card.color_identity,
        faces: []
    };

    if("card_faces" in card) {
        for(const face of card.card_faces) {
            out.faces.push({
                name: face.name,
                mana_cost: face.mana_cost,
                oracle_text: face.oracle_text,
                power: face.power,
                toughness: face.toughness,
            });
        }
    } else {
        out.faces.push({
            name: card.name,
            mana_cost: card.mana_cost,
            oracle_text: card.oracle_text,
            power: card.power,
            toughness: card.toughness,
        });
    }

    return out;
}

async function process_card(card: ScryfallCard.Any) {
    const small = minimize_card(card);

    if(llm_query === "") {
        console.log(small);
        return;
    }

    const prompt = base_prompt.replace("$QUERY", llm_query).replace("$CARD", JSON.stringify(small));

    const resp = await ollama.chat({
        model: "qwen3:8b",
        messages: [{
            role: "user",
            content: prompt
        }]
    })

    if(resp.message.content === "true") {
        console.log(small);
    }
}

const url_query = "https://api.scryfall.com/cards/search?q=" + query_components.join("+") + "&order=edhrec";

var list = await request_list(url_query);
while(true) {
    for(const card of list.data) {
        await process_card(card);
    }

    if(!list.has_more) {
        break;
    }
    list = await request_list(list.next_page);
}
