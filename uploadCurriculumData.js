const admin = require("firebase-admin");
const fs = require("fs");
const csv = require("csv-parser");

// Initialize Firebase Admin SDK
const serviceAccount = require("./new4-af3fb-firebase-adminsdk-bawyx-f8eed4cdaa.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadCurriculumData() {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream("data/OutcomesContent2.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        console.log(`CSV file read. Total rows: ${results.length}`);

        const structureData = {
          "Early Stage 1": {},
          "Stage 1": {},
          "Stage 2": {},
        };

        results.forEach((row, index) => {
          if (index === 0) {
            console.log("Sample row:", row);
          }
          const stage = row.Stage;
          const area = row.Area;
          const focusArea = row["Focus Area"];
          const contentGroup = row["Content groups"];
          const contentPoint = row["Content points"];
          const outcomeCode1 = row["Outcome Code 1"];
          const outcomeCode2 = row["Outcome Code 2"];

          if (structureData[stage]) {
            if (!structureData[stage][area]) {
              structureData[stage][area] = {};
            }
            if (!structureData[stage][area][focusArea]) {
              structureData[stage][area][focusArea] = {};
            }
            if (!structureData[stage][area][focusArea][contentGroup]) {
              structureData[stage][area][focusArea][contentGroup] = {};
            }
            if (
              !structureData[stage][area][focusArea][contentGroup][contentPoint]
            ) {
              structureData[stage][area][focusArea][contentGroup][
                contentPoint
              ] = new Set();
            }
            if (outcomeCode1)
              structureData[stage][area][focusArea][contentGroup][
                contentPoint
              ].add(outcomeCode1);
            if (outcomeCode2)
              structureData[stage][area][focusArea][contentGroup][
                contentPoint
              ].add(outcomeCode2);
          }
        });

        // Convert Sets to Arrays for outcomes
        for (const stage in structureData) {
          for (const area in structureData[stage]) {
            for (const focusArea in structureData[stage][area]) {
              for (const contentGroup in structureData[stage][area][
                focusArea
              ]) {
                for (const contentPoint in structureData[stage][area][
                  focusArea
                ][contentGroup]) {
                  structureData[stage][area][focusArea][contentGroup][
                    contentPoint
                  ] = Array.from(
                    structureData[stage][area][focusArea][contentGroup][
                      contentPoint
                    ]
                  );
                }
              }
            }
          }
        }

        console.log("Processed data:", JSON.stringify(structureData, null, 2));

        try {
          await db
            .collection("curriculum_structure")
            .doc("structure")
            .set(structureData);
          console.log("Curriculum structure uploaded successfully.");
          resolve();
        } catch (error) {
          console.error("Error uploading curriculum structure:", error);
          reject(error);
        }
      });
  });
}

async function main() {
  try {
    await uploadCurriculumData();
    console.log("Script completed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit(0);
  }
}

main();
