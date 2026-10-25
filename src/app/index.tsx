import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  shiny_img: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType = {
  normal: "#C9C9A8",
  fire: "#F5AC78",
  water: "#9DB7F5",
  electric: "#FAE078",
  grass: "#A7DB8D",
  ice: "#BCE6E6",
  fighting: "#D67873",
  poison: "#C183C1",
  ground: "#EBD69D",
  flying: "#C6B7F5",
  psychic: "#FA92B2",
  bug: "#C6D16E",
  rock: "#D1C17D",
  ghost: "#A292BC",
  dragon: "#A27DFA",
  dark: "#A29288",
  steel: "#D1D1E0",
  fairy: "#F4BDC9",
};

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  // console.log(pokemons[0]);

  useEffect(() => {
    // fetch pokemons

    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=20",
      );

      const data = await response.json();

      // console.log(data);

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            shiny_img: details.sprites.front_shiny,
            types: details.types,
          };
        }),
      );

      setPokemons(detailedPokemons);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView
      style={{ padding: 10 }}
      contentContainerStyle={{
        gap: 16,
        padding: 16,
      }}
    >
      {pokemons.map((pokemon) => (
        <Link
          key={pokemon.name}
          href={{ pathname: "/details", params: { name: pokemon.name } }}
          asChild
        >
          <Pressable>
            <View
              style={[
                styles.card,
                {
                  backgroundColor:
                    //@ts-ignore
                    colorsByType[pokemon.types[0].type.name] ?? "#E0E0E0",
                },
              ]}
            >
              <Text style={styles.name}>{pokemon.name}</Text>
              <Text style={styles.type}>{pokemon.types[0].type.name}</Text>

              <View style={styles.flexDisp}>
                <Image
                  source={{ uri: pokemon.image }}
                  style={{ width: 100, height: 100 }}
                />
                <Image
                  source={{ uri: pokemon.shiny_img }}
                  style={{ width: 100, height: 100 }}
                />
              </View>
            </View>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },

  type: {
    fontSize: 20,
    fontWeight: "heavy",
    textAlign: "center",
    marginTop: 3,
    color: "#555",
    textTransform: "capitalize",
  },

  flexDisp: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 3,
  },
});
