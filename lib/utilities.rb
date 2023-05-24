# Collection of file utilities
class Utilities
  SYSTEM_FOLDER = "system"

  def self.cleanup_db
    # delete categories without folders
    logger.info "Cleaning up categories..."
    Category.all.each(&:check_directory)
    # delete tags without folders
    logger.info "Cleaning up tags..."
    Tag.find_each(&:check_directory)
    # delete images without files
    logger.info "Cleaning up images..."
    Image.find_each(&:check_file)
    logger.info "Cleanup complete."
  end

  # Sync DB with ./inspiration folder
  def self.sync_db
    # sync categories
    logger.info "Syncing categories..."
    # create or initialize categories from folders in inspiration folder
    Category.from_directory.each do |category|
      logger.info "\tSyncing category: #{category.name}"
      logger.info "\t\tCategory synced: #{category.name}. Syncing tags..."

      # create or initialize tags from folders in category folder
      category.tags_from_directory.each do |tag|
        tag.sync_images
      end
      logger.info "\t\tTags synced."
    end
    logger.info "Categories synced."
  end

  # Merge images from ./inspiration/system/category to ./inspiration/category
  # Each ./inspiration/category/**/\d{3}.jpg with the same name belongs to one set. So during merge all the images with the same name should get merged into one set with the same \d{3} name which is available in ./inspiration/category/**/\d{3}.jpg
  def self.merge_images
    # check if system folder have categories to import
    system_categories = Dir["./inspiration/#{SYSTEM_FOLDER}/*"]
    if system_categories.empty?
      logger.info "No categories to merge"
      return
    end
    logger.info "Merging categories..."
    # collect categories names to merge
    categories = system_categories.map { |category| category.split("/").last }
    categories.each do |category|
      # delete preview file if exists at ./inspiration/#{SYSTEM_FOLDER}/category/000.jpg
      preview_file = "./inspiration/#{SYSTEM_FOLDER}/#{category}/000.jpg"
      FileUtils.rm(preview_file) if File.exist?(preview_file)
      # skip if category name is system
      next if category == SYSTEM_FOLDER
      logger.info "\tMerging category: #{category}"
      # find available \d{3} filenames in destination folder
      last_filename = Dir["./inspiration/#{category}/**/*"]
        .map { |file| file.split("/").last }.uniq
        .select { |filename| filename =~ /^\d{3}\.jpg$/ }
        .map { |filename| filename.split(".").first }
        .map(&:to_i).max || -1
      # find all the images with the same name in source folder
      source_files = Dir["./inspiration/#{SYSTEM_FOLDER}/#{category}/**/*"]
        .map { |file| file.split("/").last }.uniq
        .select { |filename| filename =~ /^\d{3}\.jpg$/ }
      # collect tags folder names from source category folder skipping the files
      source_tags = Dir["./inspiration/#{SYSTEM_FOLDER}/#{category}/*"]
        .map { |tag| tag.split("/").last }
        .select { |tag| tag !~ /^\d{3}\.jpg$/ }
      # merge images with the same name
      source_files.each do |source_file|
        last_filename += 1
        # iterate source tags and copy images to destination tags
        source_tags.each do |source_tag|
          destination_tag = "./inspiration/#{category}/#{source_tag}"
          destination_file = "#{destination_tag}/#{last_filename.to_s.rjust(3, "0")}.jpg"
          source_file_path = "./inspiration/#{SYSTEM_FOLDER}/#{category}/#{source_tag}/#{source_file}"
          source_tag_path = "./inspiration/#{SYSTEM_FOLDER}/#{category}/#{source_tag}"

          next unless File.exist?(source_file_path)
          # create destination tag directory if not exists
          FileUtils.mkdir_p(destination_tag) unless File.directory?(destination_tag)
          # copy image to destination tag keeping \d{3} with leading zeros
          FileUtils.cp(source_file_path, destination_file)
          # remove source image
          FileUtils.rm(source_file_path)
          # remove source tag directory if empty
          FileUtils.rm_rf(source_tag_path) if Dir["#{source_tag_path}/*"].empty?
        end
        # remove source category directory if empty
        source_category_path = "./inspiration/#{SYSTEM_FOLDER}/#{category}"
        FileUtils.rm_rf(source_category_path) if Dir["#{source_category_path}/*"].empty?
      end
      logger.info "\tCategory merged."
    end
    logger.info "Categories merged."
  end

  def self.logger
    @@logger ||= Logger.new($stdout)
  end
end
