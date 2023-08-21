import mongoose from "mongoose";
import Express from "express";
import cors from "cors";
import { User } from "./DB/main.js";
import XLSX from "xlsx";
import fs from "fs";

const DB =
  "mongodb+srv://vishu7im:teranaam.im7@cluster0.4tmteql.mongodb.net/counseling";

const app = Express();
const PORT = 8000;

app.use(Express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server vishal");
});

app.post("/newUser", async (req, res) => {
  const input = req.body;
  // console.log(input);
  const data = new User(input);

  try {
    await data.save();

    res.status(200).json({ msg: `${input.Name} 's form save ` });
  } catch (error) {
    res.status(404).json({ msg: "err" });
  }
});

app.post("/Report", async (req, res) => {
  try {
    const {
      DET,
      DAT,
      AIC,
      GENERAL,
      SC_SCD,
      BCA_BCB,
      TFW,
      EWS,
      PM_Care,
      HARIHAR,
      OTHER,
    } = req.body;

    // Build the query object based on conditions
    const query = {};

    if (DET === 1 && DAT === 0) {
      query.Course = "Diploma Engg Lateral Entry";
    } else if (DAT === 1 && DET === 0) {
      query.Course = "Diploma Engg";
    } else if (DAT === 1 && DET === 1) {
      res.status(404).json({ err: "select only one" });
    } else {
      res.status(404).json({ err: "Somthing went wrong " });
    }

    const categories = [
      {
        name: "AIC",
        value: "AIC",
      },
      {
        name: "GENERAL",
        value: "GENERAL",
      },
      {
        name: "SC_SCD",
        value: "SC/SCD",
      },
      {
        name: "BCA_BCB",
        value: "BCA/BCB",
      },
      {
        name: "TFW",
        value: "TFW",
      },
      {
        name: "EWS",
        value: "EWS",
      },
      {
        name: "PM_Care",
        value: "PM Care",
      },
      {
        name: "HARIHAR",
        value: "HARIHAR",
      },
      {
        name: "OTHER",
        value: "OTHER",
      },
    ];

    const selectedCategories = categories.filter(
      (category) => req.body[category.name] === 1
    );
    let selectedValues;
    if (selectedCategories.length < 8) {
      selectedValues = selectedCategories.map((category) => category.value);
      query.Category = { $in: selectedValues };
    }

    const results = await User.find(query).sort({ Percentage: -1 }).lean();

    let studentsData;
    if (DET === 1 && DAT === 0) {
      studentsData = results.map((data) => {
        delete data.__v;
        delete data._id;
        delete data.Math;
        delete data.Physics;
        delete data.English;

        return data;
      });

      studentsData.sort((a, b) => {
        // First, compare by percentage in descending order
        if (b.Percentage !== a.Percentage) {
          return b.Percentage - a.Percentage;
        }
        // Compare by age (DOB in ascending order)
        const dobA = new Date(a.DOB.split("/").reverse().join("/"));
        const dobB = new Date(b.DOB.split("/").reverse().join("/"));
        if (dobA.getTime() !== dobB.getTime()) {
          return dobA.getTime() - dobB.getTime();
        }

        // Finally, compare alphabetically by name
        return a.Name.localeCompare(b.Name);
      });
    } else if (DAT === 1 && DET === 0) {
      studentsData = results.map((data) => {
        delete data.__v;
        delete data._id;
        delete data.Qualification;

        return data;
      });

      studentsData.sort((a, b) => {
        // First, compare by percentage in descending order
        if (b.Percentage !== a.Percentage) {
          return b.Percentage - a.Percentage;
        }

        // Then, compare by math marks
        if (b.Math !== a.Math) {
          return b.Math - a.Math;
        }

        // Next, compare by physics marks
        if (b.Physics !== a.Physics) {
          return b.Physics - a.Physics;
        }

        // After that, compare by English marks
        if (b.English !== a.English) {
          return b.English - a.English;
        }

        // Compare by age (DOB in ascending order)
        const dobA = new Date(a.DOB);
        const dobB = new Date(b.DOB);
        if (dobA.getTime() !== dobB.getTime()) {
          return dobA.getTime() - dobB.getTime();
        }

        // Finally, compare alphabetically by name
        return a.Name.localeCompare(b.Name);
      });
    }

    //  setup rank
    studentsData = studentsData.map((data, i) => {
      data.Rank = i + 1;
      return data;
    });

    // rule function

    const ws = XLSX.utils.json_to_sheet(studentsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    // Specify the path where you want to save the file
    const filePath = `doc/${query.Course}${AIC === 1 ? "-AIC" : ""}${
      GENERAL === 1 ? "-GENERAL" : ""
    }${SC_SCD === 1 ? "-SC_SCD" : ""}${BCA_BCB === 1 ? "-BCA_BCB" : ""}${
      TFW === 1 ? "-TFW" : ""
    }${EWS === 1 ? "-EWS" : ""}${PM_Care === 1 ? "-PM_Care" : ""}${
      HARIHAR === 1 ? "-HARIHAR" : ""
    }${OTHER === 1 ? "-OTHER" : ""}.xlsx`;

    fs.writeFile(filePath, buffer, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "An error occurred" });

        // Handle the error appropriately
      } else {
        res.status(200).json({ msg: "file save " });

        // Perform any additional actions after saving
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/userlist/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const results = await User.find({ Course: id })
      .sort({ Percentage: -1 })
      .lean();

    let studentsData;

    if (id === "Diploma Engg") {
      studentsData = results.map((data) => {
        delete data.__v;
        delete data._id;
        delete data.Math;
        delete data.Physics;
        delete data.English;

        return data;
      });

      studentsData.sort((a, b) => {
        // First, compare by percentage in descending order
        if (b.Percentage !== a.Percentage) {
          return b.Percentage - a.Percentage;
        }
        // Compare by age (DOB in ascending order)
        const dobA = new Date(a.DOB.split("/").reverse().join("/"));
        const dobB = new Date(b.DOB.split("/").reverse().join("/"));
        if (dobA.getTime() !== dobB.getTime()) {
          return dobA.getTime() - dobB.getTime();
        }

        // Finally, compare alphabetically by name
        return a.Name.localeCompare(b.Name);
      });
    } else if (id === "Diploma Engg Lateral Entry") {
      studentsData = results.map((data) => {
        delete data.__v;
        delete data._id;
        delete data.Qualification;

        return data;
      });

      studentsData.sort((a, b) => {
        // First, compare by percentage in descending order
        if (b.Percentage !== a.Percentage) {
          return b.Percentage - a.Percentage;
        }

        // Then, compare by math marks
        if (b.Math !== a.Math) {
          return b.Math - a.Math;
        }

        // Next, compare by physics marks
        if (b.Physics !== a.Physics) {
          return b.Physics - a.Physics;
        }

        // After that, compare by English marks
        if (b.English !== a.English) {
          return b.English - a.English;
        }

        // Compare by age (DOB in ascending order)
        const dobA = new Date(a.DOB);
        const dobB = new Date(b.DOB);
        if (dobA.getTime() !== dobB.getTime()) {
          return dobA.getTime() - dobB.getTime();
        }

        // Finally, compare alphabetically by name
        return a.Name.localeCompare(b.Name);
      });
    }

    //  setup rank
    let studentsListData = studentsData.map((data, i) => {
      let obj = {
        id: i + 1,
        Name: data.Name,
        Course: data.Course,
        Cateogry: data.Category,
        Gender: data.Gender,
        DOB: data.DOB,
        Addhaar: data.AadhaarNo,
        Percentage: data.Percentage,
        Mobile: data.StudentMobileNo,
      };

      return obj;
    });
    res.status(200).json({ data: studentsListData });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

mongoose.set("strictQuery", false);
mongoose
  .connect(DB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`connection success ${PORT}`);
    });
  })
  .catch((e) => {
    console.log(e.message);
  });
