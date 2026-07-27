import React from "react";
import { useGetAllAssetQuery } from "../redux/api/assetApi"; // আপনার প্রজেক্ট অনুযায়ী পাথ ঠিক করে নিবেন
import { useGetAllLibraryQuery } from "../redux/api/libraryApi";
import { useGetAllFinalResultQuery } from "../redux/api/finalResultApi";

export default function ApiTestPage() {
  // Fetching data using RTK Query hooks
  const { data: assets, isLoading: assetLoading, error: assetError } = useGetAllAssetQuery();
  const { data: libraries, isLoading: libraryLoading, error: libraryError } = useGetAllLibraryQuery();
  const { data: finalResults, isLoading: finalResultLoading, error: finalResultError } = useGetAllFinalResultQuery();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>API Connection Test Page</h2>
      <hr style={{ margin: "20px 0" }} />

      {/* 1. Asset Section */}
      <section style={{ marginBottom: "30px" }}>
        <h3>Asset API Test</h3>
        {assetLoading && <p>Loading assets...</p>}
        {assetError && <p style={{ color: "red" }}>Error loading assets!</p>}
        {assets && (
          <div style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            <p style={{ color: "green", fontWeight: "bold" }}>✓ Asset API Working Successfully!</p>
            <pre>{JSON.stringify(assets, null, 2)}</pre>
          </div>
        )}
      </section>

      {/* 2. Library Section */}
      <section style={{ marginBottom: "30px" }}>
        <h3>Library API Test</h3>
        {libraryLoading && <p>Loading library items...</p>}
        {libraryError && <p style={{ color: "red" }}>Error loading library!</p>}
        {libraries && (
          <div style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            <p style={{ color: "green", fontWeight: "bold" }}>✓ Library API Working Successfully!</p>
            <pre>{JSON.stringify(libraries, null, 2)}</pre>
          </div>
        )}
      </section>

      {/* 3. Final Result Section */}
      <section style={{ marginBottom: "30px" }}>
        <h3>Final Result API Test</h3>
        {finalResultLoading && <p>Loading final results...</p>}
        {finalResultError && <p style={{ color: "red" }}>Error loading final results!</p>}
        {finalResults && (
          <div style={{ background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
            <p style={{ color: "green", fontWeight: "bold" }}>✓ Final Result API Working Successfully!</p>
            <pre>{JSON.stringify(finalResults, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
}