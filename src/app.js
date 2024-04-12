import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors());

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import scheduleRouter from "./routes/schedule.route.js";
import AttendanceLogRouter from "./routes/attendanceLog.route.js";
import AttendanceRouter from "./routes/attendance.route.js";
import LeaveRouter from "./routes/leave.route.js";
import DepartmentRouter from "./routes/department.route.js";
import PositionRouter from "./routes/position.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/schedule", scheduleRouter);
app.use("/api/v1/attendanceLog", AttendanceLogRouter);
app.use("/api/v1/attendance", AttendanceRouter);
app.use("/api/v1/leave", LeaveRouter);
app.use("/api/v1/department", DepartmentRouter);
app.use("/api/v1/position", PositionRouter);

export { app };
