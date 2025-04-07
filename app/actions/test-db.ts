"use server"

import { supabase } from "@/lib/supabase"

export async function testProjectImagesTable() {
  console.log("=== Testing project_images table ===")

  try {
    // First, check if the table exists
    console.log("Checking if project_images table exists...")
    const { data: tables, error: tableError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")

    if (tableError) {
      console.error("Error checking tables:", tableError)
      return { success: false, error: tableError.message }
    }

    console.log(
      "Tables in public schema:",
      tables?.map((t) => t.table_name),
    )

    const projectImagesExists = tables?.some((t) => t.table_name === "project_images")
    console.log(`project_images table exists: ${projectImagesExists}`)

    if (!projectImagesExists) {
      return {
        success: false,
        error: "project_images table does not exist",
        tables: tables?.map((t) => t.table_name),
      }
    }

    // Check table structure
    console.log("Checking project_images table structure...")
    const { data: columns, error: columnError } = await supabase
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_name", "project_images")

    if (columnError) {
      console.error("Error checking columns:", columnError)
      return { success: false, error: columnError.message }
    }

    console.log("project_images table columns:", columns)

    // Try a test insert
    console.log("Attempting test insert into project_images table...")
    const testId = `test-${Date.now()}`
    const { data: insertData, error: insertError } = await supabase
      .from("project_images")
      .insert({
        project_id: testId,
        image_url: "https://test-image-url.com/test.jpg",
        display_order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()

    if (insertError) {
      console.error("Error inserting test record:", insertError)
      return { success: false, error: insertError.message }
    }

    console.log("Test insert successful:", insertData)

    // Clean up the test record
    console.log("Cleaning up test record...")
    const { error: deleteError } = await supabase.from("project_images").delete().eq("project_id", testId)

    if (deleteError) {
      console.error("Error deleting test record:", deleteError)
      // Continue anyway
    } else {
      console.log("Test record deleted successfully")
    }

    return {
      success: true,
      message: "project_images table exists and is working correctly",
      columns,
    }
  } catch (error) {
    console.error("Error testing project_images table:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  } finally {
    console.log("=== Testing project_images table completed ===")
  }
}

