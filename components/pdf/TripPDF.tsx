import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from "@react-pdf/renderer";

import type { TripData } from "@/lib/types";

const styles = StyleSheet.create({

  page: {
    padding: 30,
    fontSize: 12,
    lineHeight: 1.6,
    color: "#111"
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000"
  },

  summary: {
    fontSize: 12,
    color: "#333",
    marginBottom: 12
  },

  cost: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000"
  },

  section: {
    marginTop: 20
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000"
  },

  daySection: {
    marginBottom: 18,
    paddingBottom: 10,
    borderBottom: "1 solid #eee"
  },

  dayTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000"
  },

  vibe: {
    fontSize: 11,
    color: "#444",
    marginBottom: 8
  },

  blockTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 2
  },

  activity: {
    marginLeft: 6,
    marginBottom: 2,
    color: "#111"
  },

  label: {
    fontWeight: "bold",
    color: "#000"
  },

  subText: {
    fontSize: 11,
    color: "#222",
    marginBottom: 2,
    marginLeft: 6
  },

  tip: {
    color: "#16a34a", // green
    marginLeft: 6,
    marginBottom: 4
  },

  purple: {
    color: "#7c3aed" // purple
  },

  hotelName: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4
  },

  rating: {
    color: "#eab308", // yellow
    fontSize: 11,
    marginTop: 2
  }

});

export default function TripPDF({ trip }: { trip: TripData }) {

  const hotel = trip?.hotels?.[0];
  const place = trip?.destinations?.[0];

  return (

    <Document>

      <Page size="A4" style={styles.page}>

        {/* TITLE */}
        <Text style={styles.title}>
          {trip?.trip_title || "Trip Itinerary"}
        </Text>

        {/* SUMMARY */}
        {trip?.summary && (
          <Text style={styles.summary}>
            {trip.summary}
          </Text>
        )}

        {/* COST */}
        <Text style={styles.cost}>
          Estimated Cost: {trip?.currency} {trip?.total_estimated_cost}
        </Text>

        {/* DAILY ITINERARY */}
        <View style={styles.section}>

          <Text style={styles.sectionTitle}>
            Day-by-Day Itinerary
          </Text>

          {trip?.daily_plan?.map((day) => (

            <View key={day.day} style={styles.daySection}>

              <Text style={styles.dayTitle}>
                Day {day.day} — {day.title || "Plan"}
              </Text>

              {day.vibe && (
                <Text style={styles.vibe}>{day.vibe}</Text>
              )}

              {/* MORNING */}
              {day.morning && (
                <>
                  <Text style={[styles.blockTitle, styles.purple]}>
                    Morning
                  </Text>

                  <Text style={styles.activity}>
                    {day.morning.place} — {day.morning.activity}
                  </Text>

                  {day.morning.food && (
                    <Text style={styles.subText}>
                      <Text style={styles.label}>Food: </Text>
                      {day.morning.food}
                    </Text>
                  )}

                  {day.morning.transport && (
                    <Text style={styles.subText}>
                      <Text style={styles.label}>Transport: </Text>
                      {day.morning.transport}
                    </Text>
                  )}

                  {day.morning.tip && (
                    <Text style={styles.tip}>
                      Tip: {day.morning.tip}
                    </Text>
                  )}
                </>
              )}

              {/* AFTERNOON */}
              {day.afternoon && (
                <>
                  <Text style={[styles.blockTitle, styles.purple]}>
                    Afternoon
                  </Text>

                  <Text style={styles.activity}>
                    {day.afternoon.place} — {day.afternoon.activity}
                  </Text>

                  {day.afternoon.food && (
                    <Text style={styles.subText}>
                      <Text style={styles.label}>Food: </Text>
                      {day.afternoon.food}
                    </Text>
                  )}

                  {day.afternoon.transport && (
                    <Text style={styles.subText}>
                      <Text style={styles.label}>Transport: </Text>
                      {day.afternoon.transport}
                    </Text>
                  )}

                  {day.afternoon.tip && (
                    <Text style={styles.tip}>
                      Tip: {day.afternoon.tip}
                    </Text>
                  )}
                </>
              )}

              {/* EVENING */}
              {day.evening && (
                <>
                  <Text style={[styles.blockTitle, styles.purple]}>
                    Evening
                  </Text>

                  <Text style={styles.activity}>
                    {day.evening.place} — {day.evening.activity}
                  </Text>

                  {day.evening.food && (
                    <Text style={styles.subText}>
                      <Text style={styles.label}>Food: </Text>
                      {day.evening.food}
                    </Text>
                  )}

                  {day.evening.transport && (
                    <Text style={styles.subText}>
                      <Text style={styles.label}>Transport: </Text>
                      {day.evening.transport}
                    </Text>
                  )}

                  {day.evening.tip && (
                    <Text style={styles.tip}>
                      Tip: {day.evening.tip}
                    </Text>
                  )}
                </>
              )}

            </View>

          ))}

        </View>

        {/* HOTEL */}
        {hotel && (
          <View style={styles.section}>

            <Text style={styles.sectionTitle}>
              Most Recommended Stay for You
            </Text>

            <Text style={styles.hotelName}>
              {hotel.name}
            </Text>

            {hotel.location && (
              <Text style={styles.subText}>
                {hotel.location}
              </Text>
            )}

            {hotel.rating && (
              <Text style={styles.rating}>
                Rating: {hotel.rating} / 5
              </Text>
            )}

          </View>
        )}

        {/* PLACE */}
        {place && (
          <View style={styles.section}>

            <Text style={styles.sectionTitle}>
              Most Recommended Place for You
            </Text>

            <Text style={styles.hotelName}>
              {place.name}
            </Text>

          </View>
        )}

      </Page>

    </Document>
  );
}