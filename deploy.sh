#!/bin/bash

echo "🚀 Inventory App - Quick Deploy Script"
echo "======================================"
echo ""

# Check if web-build exists
if [ ! -d "web-build" ]; then
    echo "📦 Building web version..."
    npx expo export --platform web --output-dir web-build
    echo "✅ Build complete!"
    echo ""
fi

echo "Choose your deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Exit"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🔷 Deploying to Vercel..."
        echo ""
        
        # Check if vercel is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "Deploying to production..."
        cd web-build
        vercel --prod
        echo ""
        echo "✅ Deployed to Vercel!"
        echo "Your app is now live! Check the URL above."
        ;;
    
    2)
        echo ""
        echo "🟢 Deploying to Netlify..."
        echo ""
        
        # Check if netlify is installed
        if ! command -v netlify &> /dev/null; then
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
        fi
        
        echo "Deploying to production..."
        cd web-build
        netlify deploy --prod
        echo ""
        echo "✅ Deployed to Netlify!"
        echo "Your app is now live! Check the URL above."
        ;;
    
    3)
        echo "Exiting..."
        exit 0
        ;;
    
    *)
        echo "Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Share your app URL with users"
echo "  2. Set up custom domain (optional)"
echo "  3. Monitor usage in platform dashboard"
echo ""
