# Saleor Product List Metadata Filter

A Saleor app that enhances the product list view by adding metadata-based filtering capabilities. This app allows you to filter products using metadata key-value pairs. Additionally suggests values from your existing Pages.

## 🌟 Features

- **Metadata-based Product Filtering**: Search and filter products using metadata key-value pairs
- **Page-based Value Suggestions**: Utilize your Saleor Pages as a source for metadata values
  - Perfect for maintaining brand lists, categories, or any other structured data
  - Type to see matching page titles as suggestions
  - Support for both suggested and custom values
- **Visual Product List**:
  - Clear presentation of matching products
  - Product thumbnails
  - Quick access to product details

## 🚀 Use Cases

### Brand Filtering
1. Create a Page for each brand in your store
2. Add brand metadata to your products (e.g., key: "brand", value: "Brand Name")
3. Use the app to quickly filter products by brand, with suggestions from your brand pages


## 📋 How to Use

https://github.com/user-attachments/assets/d70574ed-4f63-4240-a2d5-667257296698

1. Install the app in your Saleor Dashboard
2. Navigate to the Products list
3. Click on "Filter Products by Metadata" in the actions menu
4. Enter a metadata key (default: "brand-type")
5. Start typing in the value field to see suggestions from your Pages
6. Select a suggestion or enter a custom value
7. Click "Search Products" to filter the list

## 🛠️ Development

### Prerequisites
- Node.js 18.x or newer
- pnpm (recommended) or npm
- A Saleor instance (version 3.x or newer)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/szczecha/saleor-app-product-list-extention.git
   cd saleor-app-product-list-extention
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Configure your Saleor instance to use the app (see Saleor documentation for details)

## 🔗 Links

- [Saleor Metadata Documentation](https://docs.saleor.io/docs/3.x/developer/metadata)
- [Join Saleor Discord](https://saleor.io/discord)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
