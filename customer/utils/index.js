import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import BadRequestError from "./bad-request-error.js";

const generateSalt = async () => {
  return await bcrypt.genSalt();
};

const generatePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

const validatePassword = async (enteredPassword, savedPassword, salt) => {
  // implement logic to validate password
  return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

const generateToken = async (payload) => {
  try {
    return await jsonwebtoken.sign(payload, process.env.APP_SECRET, {
      expiresIn: "30 days",
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const validateSignature = async (req, res, next) => {
  let token;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ")[1]
  ) {
    token = req.headers["authorization"].split(" ")[1];
    token = await jsonwebtoken.verify(token, process.env.APP_SECRET);
    req.user = token;
    next();
  } else {
    return res.status(401).send({ success: false, message: "Access denied" });
  }
};

const createChannel = async () => {
  try {
    const connection = await amqplib.connect(process.env.MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.EXCHANGE_NAME, "direct", {
      durable: true,
    });
    return channel;
  } catch (error) {
    throw new BadRequestError(error, 400);
  }
};

const publishMessage = async (channel, service, msg) => {
  channel.publish(process.env.EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("sent", msg);
};

const subscribeMessage = async (channel, service) => {
  await channel.assertExchange(process.env.EXCHANGE_NAME, "direct", {
    durable: true,
  });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(
    q.queue,
    process.env.EXCHANGE_NAME,
    process.env.CUSTOMER_SERVICE
  );

  channel.consume(
    q.queue,
    (msg) => {
      if (msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};
export {
  generateSalt,
  generatePassword,
  validatePassword,
  generateToken,
  validateSignature,
  createChannel,
  publishMessage,
  subscribeMessage,
};
