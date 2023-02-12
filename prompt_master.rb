#!/usr/bin/env ruby
# Require all gems in Gemfile
require "bundler"
Bundler.require
# require classes recursively
Dir[File.dirname(__FILE__) + "/lib/*.rb"].each { |file| require file }

# Sinatra base
class PromptMaster < Sinatra::Base
  register Sinatra::ActiveRecordExtension

  # set root
  set :root, File.dirname(__FILE__)

  # set public folder
  set :public_folder, proc { File.join(root, "public") }

  # set views
  set :views, proc { File.join(root, "views") }

  # use better errors
  configure :development do
    use BetterErrors::Middleware
    BetterErrors.application_root = __dir__
  end

  helpers do
    # access app secrets from ./secrets.yml
    def secret(key)
      @secrets ||= YAML.load_file(File.join(__dir__, "secrets.yml"))
      @secrets[key] || ENV[key] || ""
    end
  end

  # set port
  set :port, 8080

  error do
    erb :"500"
  end

  # delete category
  delete "/category/:id" do
    content_type :json

    @category = Category.find_by_id(params[:id])
    # respond with error if category not found
    return {success: false, error: "Category not found"}.to_json if @category.nil?

    # delete category
    @category.destroy
    {success: true}.to_json
  end

  # add tag to featured tags
  put "/tag/:id/feature" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # add tag to featured tags
    @tag.update(featured: true)
    {success: true}.to_json
  end

  # remove tag from featured tags
  put "/tag/:id/unfeature" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # remove tag from featured tags
    @tag.update(featured: false)
    {success: true}.to_json
  end

  # hide tag
  put "/tag/:id/hide" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # hide tag
    @tag.update(active: false)
    {success: true}.to_json
  end

  # unhide tag
  put "/tag/:id/unhide" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # unhide tag
    @tag.update(active: true)
    {success: true}.to_json
  end

  # rate tag
  put "/tag/:id/rate" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # rate tag
    @tag.update(rank: params[:rank])
    {success: true}.to_json
  end

  # serve static files from inspiration folder
  get "/inspiration/*" do
    send_file "./inspiration/#{params[:splat].first}"
  end
  # serve static files from inspiration folder
  get "/api/inspiration/*" do
    send_file "./inspiration/#{params[:splat].first}"
  end

  # API
  # get all categories
  get "/api/categories" do
    content_type :json

    # Get all categories with first tag avoiding N+1 queries
    Category.includes(:tags).reorder('name ASC').map do |category|
      {
        id: category.id,
        name: category.name,
        image: category.image,
        image_size: category.image_size,
        tags_count: category.tags.size,
        sets_count: category.tags.first&.images&.count || 0
      }
    end.to_json
  end

  # get category by id
  get "/api/category/:id" do
    content_type :json

    @category = Category.find_by_id(params[:id])
    # respond with error if category not found
    return {success: false, error: "Category not found"}.to_json if @category.nil?

    # Get category with first tag avoiding N+1 queries
    {
      id: @category.id,
      name: @category.name,
      image: @category.image,
      image_size: @category.image_size,
      tags_count: @category.tags.size,
      sets_count: @category.tags.first&.images&.count || 0
    }.to_json
  end

  # get category tags
  get "/api/category/:id/tags" do
    content_type :json

    @category = Category.find_by_id(params[:id])
    # respond with error if category not found
    return {success: false, error: "Category not found"}.to_json if @category.nil?

    # Get category tags
    @category.tags.map(&:as_json).to_json
  end

  # update tag
  put "/api/tag/:id" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # filter allowed params (rank, active, featured)
    params = request.body.read
    params = JSON.parse(params)
    params = params.select { |k, v| %w[rank active featured].include?(k) }

    # update tag
    @tag.update(params)

    # respond with updated tag
    @tag.to_json
  end

    # delete tag from database and all associated images from disk
  delete "/api/tag/:id" do
    content_type :json

    @tag = Tag.find_by_id(params[:id])
    # respond with error if tag not found
    return {success: false, error: "Tag not found"}.to_json if @tag.nil?

    # delete tag
    @tag.destroy
    {success: true}.to_json
  end

  # root route responds with index.html from public folder
  get "/*" do
    send_file File.join(settings.public_folder, "index.html")
  end
end
