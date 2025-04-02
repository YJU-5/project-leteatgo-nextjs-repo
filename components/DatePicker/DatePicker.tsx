import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";

const StyledDemoContainer = styled(DemoContainer)({
  position: "relative",
  width: "100%",
  "& .MuiStack-root": {
    width: "100%",
  },
});

const StyledDatePicker = styled(DatePicker)({
  width: "100%",
  margin: "0",
  padding: "0",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  "& .MuiPickersDay-root": {
    color: "#000000",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    "&.Mui-selected": {
      backgroundColor: "#564b9a",
      borderRadius: "10px",
      color: "#ffffff",
      "&:hover": {
        backgroundColor: "#443a7a",
        borderRadius: "10px",
      },
    },
    "&:hover": {
      backgroundColor: "#f0edf7",
      borderRadius: "10px",
    },
  },
  "& .MuiPickersCalendarHeader-root": {
    position: "sticky",
    top: 0,
    backgroundColor: "#ffffff",
    zIndex: 1,
  },
  "& .MuiPickersCalendarHeader-label": {
    color: "#000000",
    borderRadius: "10px",
  },
  "& .MuiInputBase-root": {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    "& .MuiInputBase-input": {
      color: "#000000",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#666666",
    borderRadius: "10px",
  },
  "& .MuiPaper-root": {
    position: "fixed",
    zIndex: 9999,
    maxHeight: "400px",
    overflow: "hidden",
    "& .MuiPickersCalendarHeader-root": {
      position: "sticky",
      top: 0,
      backgroundColor: "#ffffff",
      zIndex: 1,
    },
  },
  "& .MuiPickersCalendarHeader-switchViewButton": {
    position: "relative",
    zIndex: 2,
  },
  "& .MuiPickersCalendarHeader-switchViewIcon": {
    position: "relative",
    zIndex: 2,
  },
});

interface DatePickerProps {
  value: Date | null;
  onChange: (newValue: Date | null) => void;
}

export default function DatePickerComponent({
  value,
  onChange,
}: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StyledDemoContainer components={["DatePicker", "DatePicker"]}>
        <StyledDatePicker
          format="YYYY.MM.DD"
          showDaysOutsideCurrentMonth
          value={value ? dayjs(value) : null}
          onChange={(newValue) => onChange(newValue?.toDate() ?? null)}
          views={["year", "month", "day"]}
          openTo="month"
          slotProps={{
            textField: {
              size: "small",
            },
            popper: {
              placement: "bottom-end",
            },
            calendarHeader: {
              sx: {
                position: "sticky",
                top: 0,
                backgroundColor: "#ffffff",
                zIndex: 1,
              },
            },
          }}
        />
      </StyledDemoContainer>
    </LocalizationProvider>
  );
}
