# Attendance Export Feature Documentation

## Overview
This feature exports attendance summaries as downloadable Excel files, with separate reports for each stream (CS, SE, CE). The reports show attendance percentages for each student across all their lectures.

## Endpoint

```
GET /api/attendance/export
```

### Query Parameters

| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `stream` | string | Yes | Student stream (CS, SE, or CE) | `CS` |
| `startDate` | string | Yes | Start date in YYYY-MM-DD format | `2025-01-01` |
| `endDate` | string | Yes | End date in YYYY-MM-DD format | `2025-12-31` |

### Example Requests

```http
# Export CS stream attendance summary
GET http://localhost:5000/api/attendance/export?stream=CS&startDate=2025-01-01&endDate=2025-12-31

# Export SE stream attendance summary
GET http://localhost:5000/api/attendance/export?stream=SE&startDate=2025-11-01&endDate=2025-11-30

# Export CE stream attendance summary
GET http://localhost:5000/api/attendance/export?stream=CE&startDate=2025-01-01&endDate=2025-06-30
```

## Excel File Structure

### Row 1: Lecturing Days Count
- **Merged Cells (A1:C1)**: "No of Lecturing Days for the Period"
- **Following Columns**: Total number of finalized sessions for each lecture
- **Last Column**: Empty (for Overall)

### Row 2: Headers
- **No**: Sequential number (01, 02, 03...)
- **Reg. No.**: Student registration number
- **Name**: Student full name
- **Lecture Abbreviations**: Short forms of lecture names (e.g., RWS, OOP, MATH)
- **Overall**: Average attendance across all lectures

### Data Rows (Row 3+)
Each row contains:
- Student number (padded with leading zero)
- Registration number
- Student name
- Attendance percentage for each lecture (rounded to ceiling)
- Overall attendance percentage (average of all lectures)

## Lecture Name Abbreviation Logic

### Multiple Words
Takes the first letter of each word in uppercase:
- "Research Writing Skills" → **RWS**
- "Object-Oriented Programming" → **OOP**
- "Data Structures & Algorithms" → **DSA**

### Single Word
Takes the first 4 letters in uppercase:
- "Mathematics" → **MATH**
- "Physics" → **PHYS**
- "Ethics" → **ETHI**

## Attendance Calculation

### Formula
```
Attendance % = (Number of Present Marks / Total Finalized Sessions) × 100
```

### Finalized Sessions
- Only counts sessions with `status: "finalized"` from `class_sessions` collection
- Must be within the specified date range
- Grouped by `lecture_id`

### Present Marks
- Counts all records from `attendance` collection
- Matches `student_email` and `lecture_code`
- Must be within the specified date range

### Rounding
All percentages are rounded up to the nearest integer using `Math.ceil()`

## Conditional Formatting

### Warning Threshold: < 80%
When attendance percentage is below 80:
- **Font Color**: Red (#FF0000)
- **Background**: Light Yellow (#FFFF00)

This applies to:
- Individual lecture columns
- Overall attendance column

## Data Sources

### Collections Used
1. **students**: Get students filtered by stream
2. **lectures**: Get lectures available for the stream
3. **class_sessions**: Count finalized sessions per lecture
4. **attendance**: Get attendance records for percentage calculation

### Student Filtering
```javascript
{ stream: "CS" } // or "SE" or "CE"
```

### Lecture Filtering
```javascript
{ streams: "CS" } // lectures that include the stream
```

### Session Filtering
```javascript
{
  lecture_id: "DL4162",
  status: "finalized",
  date: { $gte: "2025-01-01", $lte: "2025-12-31" }
}
```

### Attendance Filtering
```javascript
{
  date: { $gte: "2025-01-01", $lte: "2025-12-31" }
}
```

## Response

### Success Response
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition**: `attachment; filename="CS_Attendance_Summary_2025-01-01_to_2025-12-31.xlsx"`
- **Body**: Excel file binary data

### Error Responses

#### Missing Stream Parameter
```json
{
  "success": false,
  "message": "Stream parameter is required (CS, SE, or CE)"
}
```
**Status Code**: 400

#### Invalid Stream
```json
{
  "success": false,
  "message": "Invalid stream. Must be CS, SE, or CE"
}
```
**Status Code**: 400

#### Missing Date Parameters
```json
{
  "success": false,
  "message": "startDate and endDate parameters are required (YYYY-MM-DD format)"
}
```
**Status Code**: 400

#### No Students Found
```json
{
  "success": false,
  "message": "No students found for stream CS"
}
```
**Status Code**: 404

#### No Lectures Found
```json
{
  "success": false,
  "message": "No lectures found for stream CS"
}
```
**Status Code**: 404

#### Server Error
```json
{
  "success": false,
  "message": "Failed to export attendance summary",
  "error": "Error details..."
}
```
**Status Code**: 500

## Implementation Details

### File Location
- **Controller**: `backend/src/controllers/attendanceExportController.js`
- **Route**: `backend/src/routes/attendance.js`

### Dependencies
```json
{
  "exceljs": "^4.x.x"
}
```

### Key Functions

#### `generateLectureAbbreviation(subject)`
Converts lecture names to short abbreviations

#### `exportAttendanceSummary(req, res)`
Main controller function that:
1. Validates query parameters
2. Fetches students, lectures, sessions, and attendance
3. Calculates percentages
4. Generates Excel file
5. Applies formatting and styling
6. Sends file as download

## Column Widths
- **No**: 5 units
- **Reg. No.**: 20 units
- **Name**: 30 units
- **Lecture columns**: 10 units each
- **Overall**: 10 units

## File Naming Convention
```
{STREAM}_Attendance_Summary_{START_DATE}_to_{END_DATE}.xlsx
```

Examples:
- `CS_Attendance_Summary_2025-01-01_to_2025-12-31.xlsx`
- `SE_Attendance_Summary_2025-11-01_to_2025-11-30.xlsx`
- `CE_Attendance_Summary_2025-01-01_to_2025-06-30.xlsx`

## Testing

### Test with curl
```bash
curl -OJ "http://localhost:5000/api/attendance/export?stream=CS&startDate=2025-01-01&endDate=2025-12-31"
```

### Test with REST Client (VS Code)
See `backend/api-tests.http` for example requests

### Test with Browser
Simply paste the URL in your browser:
```
http://localhost:5000/api/attendance/export?stream=CS&startDate=2025-01-01&endDate=2025-12-31
```

## Notes

- Students are sorted by `index_number` in ascending order
- Lectures are sorted by `subject` name alphabetically
- If a student has no attendance records for a lecture, percentage shows as 0%
- If a lecture has no finalized sessions, all students show 0% for that lecture
- Overall percentage is calculated as the mean of all individual lecture percentages
- Empty cells in attendance data are handled gracefully (treated as 0)
