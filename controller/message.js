const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
// create message
exports.createMessage = async (req, res) => {
  const { email, name } = req.body;

  try {
    if (!email || !name) {
      return res.status(424).json({ message: "Email and name is required " });
    } else {
      // let companyMessage = "You have a new order";
      // let customerMessage = "Your order has been received successfully";
      // console.log(isCustomerEmail ? customerMessage : companyMessage);
      const apiKey = process.env.SEND_IN_BLUE_KEY;
      const url = process.env.SEND_IN_BLUE_URL;
      let storeData = {
        sender: {
          email: "kelvinmati45@gmail.com",
        },
        to: [
          {
            email: "kelvinmati45@gmail.com",
          },
        ],
        bcc: [
          {
            email: "helen9766@example.com",
          },
          {
            email: "helen9766@example.com",
          },
        ],
        cc: [
          {
            email: "ann6533@example.com",
          },
        ],
        htmlContent: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <div>
            <h2>You've got new order from ${name}</h2>
            <h3>Ordered product(s)</h3>
            <table style="width: 100%">
              <thead
                style="
                  background-color: rgba(128, 128, 128, 0.267);
                  text-align: left;
                  text-transform: uppercase;
                "
              >
                <tr>
                  <th style="padding: 7px">Image</th>
                  <th style="padding: 7px">Item</th>
                  <th style="padding: 7px">Quantity</th>
                  <th style="padding: 7px">Price</th>
                </tr>
              </thead>
              <tbody>
                ${products.map((product) => {
                  const {} = product;
                  return `
                <tr>
                  <td style="padding: 6px">
                    <img
                      src="https://ke.jumia.is/cms/TNG/L1/Fashion/Master/MensFL/Sneakers_M.png"
                      alt=""
                      style="width: 100px; height: 100px"
                    />
                  </td>
                  <td style="padding: 6px">
                    Waanzilish Mens Sneakers Shoes Outdoor Hiking Shoes
                  </td>
                  <td style="padding: 6px">2</td>
                  <td style="padding: 6px">ksh 1,500</td>
                </tr>`;
                })}
              </tbody>
            </table>
          </div>
        </body>
      </html>`,
        subject: "Order Confirmation",
        replyTo: {
          email: ` ${email}`,
        },
      };
      let customerData = {
        sender: {
          // name: "TEST COMPANY",
          email: "kelvinmati45@gmail.com",
        },
        to: [
          {
            email: `${email}`,
            // name: "Kelvin",
          },
        ],
        bcc: [
          {
            email: "helen9766@example.com",
            // name: "Helen",
          },
          {
            email: "helen9766@example.com",
            // name: "Helen",
          },
        ],
        cc: [
          {
            email: "ann6533@example.com",
            // name: "Ann",
          },
        ],
        htmlContent: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <div>
            <h2>
          Your order has been received
            </h2>
            <h3>Ordered product(s)</h3>
            <table style="width: 100%">
              <thead
                style="
                  background-color: rgba(128, 128, 128, 0.267);
                  text-align: left;
                  text-transform: uppercase;
                "
              >
                <tr>
                  <th style="padding: 7px">Image</th>
                  <th style="padding: 7px">Item</th>
                  <th style="padding: 7px">Quantity</th>
                  <th style="padding: 7px">Price</th>
                </tr>
              </thead>
              <tbody>
                ${products.map((product) => {
                  const {} = product;
                  return `
                <tr>
                  <td style="padding: 6px">
                    <img
                      src="https://ke.jumia.is/cms/TNG/L1/Fashion/Master/MensFL/Sneakers_M.png"
                      alt=""
                      style="width: 100px; height: 100px"
                    />
                  </td>
                  <td style="padding: 6px">
                    Waanzilish Mens Sneakers Shoes Outdoor Hiking Shoes
                  </td>
                  <td style="padding: 6px">2</td>
                  <td style="padding: 6px">ksh 1,500</td>
                </tr>`;
                })}
              </tbody>
            </table>
          </div>
        </body>
      </html>`,
        subject: "Order Confirmation",
        replyTo: {
          email: "kelvinmati45@gmail.com",
        },
      };
      const headers = {
        "Content-Type": "application/json",
        "api-key": apiKey,
      };

      const StoreRes = await axios.post(url, storeData, { headers });
      const customerRes = await axios.post(url, customerData, { headers });

      // const result = stringify(response);
      console.log("Email sent  successfully.");
      res.status(200).json({ message: "Email sent  successfully" });
    }
  } catch (error) {
    console.error("Error updating template data:", error);
    res.status(500).json(error);
  }
};

function stringify(obj) {
  let cache = [];
  let str = JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
  cache = null; // reset the cache
  return str;
}

const products = [1, 2];

// const fillTemplateData = async () => {
//   try {

//   } catch (error) {
//     console.error("Error updating template data:", error);
//   }
// };

// async function sendEmail() {
//   try {
//     const apiKey =
//       "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";
//     const url = "https://api.sendinblue.com/v3/smtp/email";

//     const data = {
//       sender: {
//         name: "From Test Account",
//         email: "noreply@gmail.com",
//       },
//       to: [
//         {
//           email: "kelvinmati45@gmail.com",
//         },
//       ],
//       templateId: 2,
//       params: {
// name: "steve",
// email: "steve@gmail.com",
// address: "Rongai",
// phone: "0757852876",
//       },
//     };

//     const headers = {
//       "Content-Type": "application/json",
//       "api-key": apiKey,
//     };

//     const response = await axios.post(url, data, { headers });
//     console.log("Email sent successfully.");
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// }

// 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
