import CustomerService from "../../services/customer.js";
//import logger from "../middleware/logger.js";
const customerService = new CustomerService();

const appEvents = async (app) => {
  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;
    try {
      let customerEntity = await customerService.subscribeEvents(payload);
      // customerEntity = formatData(customerEntity);
      res.send(payload);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export default appEvents;
