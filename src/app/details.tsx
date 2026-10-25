import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

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

export default function Details() {
  const params = useLocalSearchParams();
  // console.log(params);

  const [pokemonDetails, setPokemonDetails] = useState<any>(null);

  useEffect(() => {
    fetchPokemonDetails();
  }, [params.name]);

  async function fetchPokemonDetails() {
    try {
      //   console.log(params.name);

      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${params.name}`,
      );

      //   console.log(res);

      const data = await res.json();
      setPokemonDetails(data);

      //   console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(error);
    }
  }

  const bgColor =
    // @ts-ignore
    colorsByType[pokemonDetails?.types?.[0]?.type?.name] ?? "#E0E0E0";

  return (
    <>
      <Stack.Screen options={{ title: params.name as string }} />
      <ScrollView
        style={{ backgroundColor: bgColor }}
        contentContainerStyle={{
          gap: 16,
          padding: 16,
        }}
      >
        {pokemonDetails && (
          <View style={styles.card}>
            <Text style={styles.name}>{pokemonDetails.name}</Text>

            <Image
              source={{ uri: pokemonDetails.sprites.front_default }}
              style={{ width: 150, height: 150, alignSelf: "center" }}
            />

            <Text style={styles.info}>
              Height: {pokemonDetails.height / 10} m
            </Text>
            <Text style={styles.info}>
              Weight: {pokemonDetails.weight / 10} kg
            </Text>
            <Text style={styles.info}>
              Types:{" "}
              {pokemonDetails.types.map((t: any) => t.type.name).join(", ")}
            </Text>

            <Text style={styles.info}>
              Abilities:{" "}
              {pokemonDetails.abilities
                .map((a: any) => a.ability.name)
                .join(", ")}
            </Text>

            <Text style={[styles.heading, { color: bgColor }]}>Base Stats</Text>
            {pokemonDetails.stats.map((s: any) => (
              <Text key={s.stat.name} style={styles.info}>
                {s.stat.name}: {s.base_stat}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "capitalize",
  },

  info: {
    fontSize: 18,
    textTransform: "capitalize",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    gap: 8,
  },
});
